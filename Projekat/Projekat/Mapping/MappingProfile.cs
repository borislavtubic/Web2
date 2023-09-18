using AutoMapper;
using Projekat.Dto;
using Projekat.Models;

namespace Projekat.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserRegisterDto>().ReverseMap(); 
            CreateMap<Item, ItemDto>().ReverseMap();
            CreateMap<Verification, VerificationDto>().ReverseMap();
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Order, OrderCancelCheckDto>().ReverseMap();
            CreateMap<ItemsInsideOrder, ItemsInsideOrderDto>().ReverseMap();
        }
    }
}
