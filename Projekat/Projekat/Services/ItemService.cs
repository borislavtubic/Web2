using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Projekat.Data;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using Projekat.Repository;

namespace Projekat.Services
{
    public class ItemService : IItemService
    {

        private readonly IMapper _mapper;
        private readonly ItemRepo _itemRepo;

        public ItemService(IMapper mapper, ItemRepo itemRepo)
        {
            _mapper = mapper;
            _itemRepo = itemRepo;
        }

        public ItemDto CreateItem(ItemDto itemCreate)
        {
            try
            {
                Item item = _mapper.Map<Item>(itemCreate);
                _itemRepo.Add(item);
                _itemRepo.Save();

                return _mapper.Map<ItemDto>(item);
            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<ItemDto> GetItemsBySellerId(long sellerId)
        {
            try
            {
                return _mapper.Map<List<ItemDto>>(_itemRepo.GetAll(sellerId));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool DeleteItem(long id)
        {
            try
            {
                Item item = _itemRepo.Get(id);

                _itemRepo.Delete(item);

                _itemRepo.Save();

                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public ItemDto UpdateItem(long id, ItemDto newItem)
        {
            try
            {
                Item noviItem = _mapper.Map<Item>(newItem);

                Item itemDB = _itemRepo.Update(id, noviItem);

                _itemRepo.Save();

                return _mapper.Map<ItemDto>(itemDB);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemDto UpdateItemAfterOrder(long id, int amount)
        {
            Item itemDB = _itemRepo.Get(id);
            itemDB.Amount -= amount;
            _itemRepo.Save();

            return _mapper.Map<ItemDto>(itemDB);
        }


        public List<ItemDto> GetAll()
        {
            try
            {
                return _mapper.Map<List<ItemDto>>(_itemRepo.GetAllItems());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemDto GetItemById(long id)
        {
            return _mapper.Map<ItemDto>(_itemRepo.Get(id));
        }

        public List<ItemDto> GetItemsByOrderId(long orderId)
        {
            try
            {
                List<ItemsInsideOrderDto> itemsInsideOrderDto = _mapper.Map<List<ItemsInsideOrderDto>>(_itemRepo.GetAllItemsInsideOrder(orderId));
                List<ItemDto> items = new List<ItemDto>();
                foreach (var item in itemsInsideOrderDto)
                {
                    ItemDto itemDB = GetItemById(item.ItemId);
                    itemDB.Amount = item.Amount;
                    items.Add(itemDB);
                }
                return items;
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}
