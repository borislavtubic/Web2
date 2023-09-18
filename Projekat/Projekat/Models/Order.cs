namespace Projekat.Models
{
    public enum OrderStatus
    {
        IN_PROCESS = 0, DONE = 1, CANCELED = 2
    }
    public class Order
    {
        public long Id { get; set; }
        public double Price { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public OrderStatus Status { get; set; }
        public long SellerId { get; set; }
        public long BuyerId { get; set; }
        public string OrderTime { get; set; }
        public string OrderArriving { get; set; }
        public List<Item> Items { get; set; }
    }
}
