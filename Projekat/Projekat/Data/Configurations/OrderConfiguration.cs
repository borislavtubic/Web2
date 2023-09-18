using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projekat.Models;

namespace Projekat.Data.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id); //Podesavam primarni kljuc tabele

            builder.Property(x => x.Id).ValueGeneratedOnAdd(); //Kazem da ce se primarni kljuc
                                                               //automatski generisati prilikom dodavanja,
                                                               //redom 1 2 3...

            builder.Property(x => x.Address).HasMaxLength(20);//kazem da je maks duzina 30 karaktera

            builder.Property(x => x.Comment).HasMaxLength(30);//kazem da je maks duzina 30 karaktera

            builder.HasMany(x => x.Items)
                   .WithMany(x => x.Orders);
        }
    }
}
