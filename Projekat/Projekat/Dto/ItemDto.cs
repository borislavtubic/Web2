namespace Projekat.Dto
{
    public class ItemDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public long SellerId { get; set; }
    }
}
