using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IItemService
    {
        ItemDto CreateItem(ItemDto itemCreate);
        List<ItemDto> GetItemsBySellerId(long sellerId);
        bool DeleteItem(long id);
        ItemDto UpdateItem(long id, ItemDto itemDto);
        List<ItemDto> GetAll();
        ItemDto UpdateItemAfterOrder(long id, int amount);
        List<ItemDto> GetItemsByOrderId(long orderId);
    }
}
