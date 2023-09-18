using AutoMapper;
using Projekat.Interfaces;
using Projekat.Models;

namespace Projekat.Repository
{
    public class OrderRepo
    {
        private readonly DataContext _dataContext;

        public OrderRepo(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public void Add(Order order)
        {
            _dataContext.Orders.Add(order);
        }

        public void AddItem(ItemsInsideOrder itemOrder)
        {
            _dataContext.ItemsInsideOrders.Add(itemOrder);
        }

        public List<Order> GetOrdersByBuyer(long buyerId)
        {
            return _dataContext.Orders.ToList().FindAll(x => x.BuyerId == buyerId && x.Status != OrderStatus.CANCELED);
        }

        public List<Order> GetOrdersBySeller(long sellerId)
        {
            return _dataContext.Orders.ToList().FindAll(x => x.SellerId == sellerId && x.Status == OrderStatus.DONE);
        }

        public List<Order> GetAll()
        {
            return _dataContext.Orders.ToList();
        }

        public Order Get(long id)
        {
            return _dataContext.Orders.Find(id);
        }


        public void Save()
        {
            _dataContext.SaveChanges();
        }
    }
}
