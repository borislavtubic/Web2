namespace Projekat.Models
{
    public enum UserType
    {
        ADMIN = 0, BUYER = 1, SELLER = 2
    }
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Date { get; set; }
        public string Address { get; set; }
        public UserType Type { get; set; }
        public string Picture { get; set; }
    }
}
