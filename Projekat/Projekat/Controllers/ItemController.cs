using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/items")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "prodavac")]
        public IActionResult CreateItem([FromBody] ItemDto itemCreateDto)
        {
            ItemDto item = _itemService.CreateItem(itemCreateDto);
            if (item == null)
            {
                return BadRequest("Desila se greska prilikom kreiranja proizvoda!");
            }
            return Ok(item);
        }

        [HttpGet("{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetItemsBySellerId(long sellerId)
        {
            List<ItemDto> items = new List<ItemDto>();
            items = _itemService.GetItemsBySellerId(sellerId);
            if(items == null)
            {
                return BadRequest("Desila se greska prilikom pretrage proizvoda!");
            }
            return Ok(items);
        }

        [HttpGet("byOrder/{orderId}")]
        [Authorize(Roles = "kupac,prodavac,admin")]
        public IActionResult GetItemsByOrderId(long orderId)
        {
            List<ItemDto> items = new List<ItemDto>();
            items = _itemService.GetItemsByOrderId(orderId);
            if(items == null)
            {
                return BadRequest("Desila se greska prilikom pretrage proizvoda!");
            }
            return Ok(items);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult DeleteItem(long id)
        {
            bool result = _itemService.DeleteItem(id);
            if (result == false)
            {
                return BadRequest("Desila se greska prilikom brisanja proizvoda!");
            }
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult UpdateItem(long id, [FromBody] ItemDto itemDto)
        {
            ItemDto item = _itemService.UpdateItem(id, itemDto);
            if(item == null)
            {
                return BadRequest("Desila se greska prilikom izmjene proizvoda!");
            }
            return Ok(item);
        }

        [HttpGet("all")]
        [Authorize(Roles = "kupac")]
        public IActionResult GetAll()
        {
            List<ItemDto> items = _itemService.GetAll();
            if(items == null)
            {
                return BadRequest("Desila se greska prilikom dobavljanja svih proizvoda!");
            }
            return Ok(items);
        }
    }
}
