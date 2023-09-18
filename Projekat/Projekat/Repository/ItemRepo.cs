using AutoMapper;
using Projekat.Models;

namespace Projekat.Repository
{
    public class ItemRepo
    {
        private readonly DataContext _dataContext;

        public ItemRepo(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public void Add(Item item)
        {
            _dataContext.Items.Add(item);
        }

        public List<Item> GetAll(long sellerId)
        {
            return _dataContext.Items.ToList().FindAll(x => x.SellerId == sellerId);
        }

        public List<Item> GetAllItems()
        {
            return _dataContext.Items.ToList();
        }

        public List<ItemsInsideOrder> GetAllItemsInsideOrder(long orderId)
        {
            return _dataContext.ItemsInsideOrders.ToList().FindAll(x => x.OrderId == orderId);
        }

        public Item Get(long id)
        {
            return _dataContext.Items.Find(id);
        }

        public Item Update(long id, Item noviItem)
        {
            Item itemDB = Get(id);

            itemDB.Name = noviItem.Name;
            itemDB.Price = noviItem.Price;
            itemDB.Picture = noviItem.Picture;
            itemDB.Amount = noviItem.Amount;
            itemDB.Description = noviItem.Description;

            return itemDB;
        }

        public void Delete(Item item)
        {
            _dataContext.Items.Remove(item);
        }

        public void Save()
        {
            _dataContext.SaveChanges();
        }
    }
}
