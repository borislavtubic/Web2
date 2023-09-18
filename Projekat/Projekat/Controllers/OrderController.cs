using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "kupac")]
        public IActionResult CreateOrder([FromBody] OrderDto orderDto)
        {
            OrderDto order = _orderService.CreateOrder(orderDto);
            if (order == null)
                return BadRequest("Desila se greska prilikom kreiranja porudzbine!");
            return Ok(order);
        }

        [HttpGet("buyer/{buyerId}")]
        [Authorize(Roles = "kupac")]
        public IActionResult GetOrdersByBuyerId(long buyerId)
        {
            List<OrderCancelCheckDto> orders = new List<OrderCancelCheckDto>();
            orders = _orderService.GetOrdersByBuyerId(buyerId);
            if(orders == null)
                return BadRequest("Desila se greska prilikom preuzimanja porudzbina!");
            return Ok(orders);
        }

        [HttpGet("newOrders/{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetNewOrdersBySellerId(long sellerId)
        {
            List<OrderDto> orders = new List<OrderDto>();
            orders = _orderService.GetNewOrdersBySellerId(sellerId);
            if(orders == null)
            {
                return BadRequest("Desila se greska prilikom preuzimanja porudzbina!");
            }
            return Ok(orders);
        }

        [HttpGet("pastOrders/{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetPastOrdersBySellerId(long sellerId)
        {
            List<OrderDto> orders = new List<OrderDto>();
            orders = _orderService.GetPastOrdersBySellerId(sellerId);
            if (orders == null)
            {
                return BadRequest("Desila se greska prilikom preuzimanja porudzbina!");
            }
            return Ok(orders);
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAll()
        {
            List<OrderDto> orders = new List<OrderDto>();
            orders = _orderService.GetAll();
            if (orders == null)
            {
                return BadRequest("Desila se greska prilikom preuzimanja porudzbina!");
            }
            return Ok(orders);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "kupac")]
        public IActionResult DeleteOrder(long id)
        {
            OrderDto order = _orderService.DeleteOrder(id);
            if(order == null)
                return BadRequest("Desila se greska prilikom brisanja porudzbine!");
            return Ok(order);
        }
    }
}
