using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IOrderService
    {
        OrderDto CreateOrder(OrderDto orderDto);
        List<OrderCancelCheckDto> GetOrdersByBuyerId(long buyerId);
        List<OrderDto> GetNewOrdersBySellerId(long sellerId);
        List<OrderDto> GetPastOrdersBySellerId(long sellerId);
        List<OrderDto> GetAll();
        OrderDto DeleteOrder(long id);
    }
}
