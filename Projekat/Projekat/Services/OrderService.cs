using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using Projekat.Repository;
using System.Collections.Generic;
using System.Globalization;

namespace Projekat.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly OrderRepo _orderRepo;
        private readonly ItemRepo _itemRepo;
        private readonly IItemService _itemService;

        public OrderService(IMapper mapper, OrderRepo orderRepo, IItemService itemService, ItemRepo itemRepo)
        {
            _mapper = mapper;
            _orderRepo = orderRepo;
            _itemService = itemService;
            _itemRepo = itemRepo;
        }

        public OrderDto CreateOrder(OrderDto orderDto)
        {
            try
            {
                Order order = _mapper.Map<Order>(orderDto);
                order.Status = OrderStatus.IN_PROCESS;
                DateTime orderTime = DateTime.ParseExact(order.OrderTime, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
                int rng = GetNumber();
                DateTime targetTime = orderTime.AddMinutes(rng);
                order.OrderArriving = targetTime.ToString("M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);

                _orderRepo.Add(order);
                _orderRepo.Save();

                int counter = 0;
                foreach (var itemId in orderDto.Ids)
                {
                    ItemDto item = _itemService.UpdateItemAfterOrder(itemId, orderDto.Amounts[counter]);

                    ItemsInsideOrderDto itemOrderDto = new ItemsInsideOrderDto();
                    itemOrderDto.ItemId = itemId;
                    itemOrderDto.OrderId = order.Id;
                    itemOrderDto.Amount = orderDto.Amounts[counter];

                    ItemsInsideOrder itemOrder = _mapper.Map<ItemsInsideOrder>(itemOrderDto);

                    _orderRepo.AddItem(itemOrder);
                    _orderRepo.Save();

                    counter++;
                }

                return _mapper.Map<OrderDto>(order);
            }
            catch (Exception)
            {
                return null;
            }
            
        }

        public List<OrderCancelCheckDto> GetOrdersByBuyerId(long buyerId)
        {
            try
            {
                List<Order> orders = _orderRepo.GetOrdersByBuyer(buyerId);
                List<int> otkazi = new List<int>();
                int otkaz = 0;
                foreach (var order in orders)
                {
                    if (order.Status == OrderStatus.IN_PROCESS)
                    {
                        Tuple<int, int> rezultat = CalculateTime(order.OrderTime, order.OrderArriving, otkaz);

                        if (rezultat.Item1 == 1)
                            otkazi.Add(1);
                        else
                            otkazi.Add(0);
                        otkaz = 0;

                        if (rezultat.Item2 == 1)
                        {
                            order.Status = OrderStatus.DONE;
                            _orderRepo.Save();
                        }
                    }
                    else
                        otkazi.Add(0);
                }
                List<OrderCancelCheckDto> orderCancelCheckDtos = _mapper.Map<List<OrderCancelCheckDto>>(orders);
                int counter = 0;
                foreach (var order in orderCancelCheckDtos)
                {
                    order.Cancel = otkazi[counter];
                    counter++;
                }

                return orderCancelCheckDtos;
            }
            catch (Exception)
            {
                return null;
            }
           
        }

        public List<OrderDto> GetNewOrdersBySellerId(long sellerId)
        {
            try
            {
                List<Order> orders = _orderRepo.GetOrdersByBuyer(sellerId);
                List<OrderDto> orderDtos = new List<OrderDto>();

                foreach (var order in orders)
                {
                    if (order.Status == OrderStatus.IN_PROCESS)
                    {
                        int temp = -1;
                        Tuple<int, int> rezultat = CalculateTime(order.OrderTime, order.OrderArriving, temp);

                        if (rezultat.Item2 == 1)
                        {
                            order.Status = OrderStatus.DONE;
                            _orderRepo.Save();
                        }
                        else
                            orderDtos.Add(_mapper.Map<OrderDto>(order));
                    }
                }

                return orderDtos;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<OrderDto> GetPastOrdersBySellerId(long sellerId)
        {
            try
            {
                List<Order> orders = _orderRepo.GetOrdersBySeller(sellerId);
                return _mapper.Map<List<OrderDto>>(orders);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<OrderDto> GetAll()
        {
            try
            {
                return _mapper.Map<List<OrderDto>>(_orderRepo.GetAll());

            }
            catch (Exception)
            {
                return null;
            }
        }

        public OrderDto DeleteOrder(long id)
        {
            try
            {
                List<ItemsInsideOrder> itemsInsideOrder = _itemRepo.GetAllItemsInsideOrder(id);
                foreach (var item in itemsInsideOrder)
                {
                    Item itemDB = _itemRepo.Get(item.ItemId);
                    itemDB.Amount += item.Amount;
                    _orderRepo.Save();
                }

                Order order = _orderRepo.Get(id);
                order.Status = OrderStatus.CANCELED;
                _orderRepo.Save();

                return _mapper.Map<OrderDto>(order);
            }
            catch (Exception)
            {
                return null;
            }
            
        }

        public static Tuple<int, int> CalculateTime(string orderTime, string orderArriving, int otkaz)
        {
            DateTime orderDateTime = DateTime.ParseExact(orderTime, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
            DateTime targetTime = DateTime.ParseExact(orderArriving, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
            DateTime currentTime = DateTime.Now;
            int delivered = 0;

            if (targetTime < currentTime)
            {
                delivered = 1;
            }
            else if (currentTime < orderDateTime.AddHours(1))
            {
                otkaz = 1;
            }

            Tuple<int, int> rezultat = new Tuple<int, int>(otkaz, delivered);
            return rezultat;
        }

        public int GetNumber()
        {
            Random random = new Random();
            int randomNumber = random.Next(60, 181);
            return randomNumber;
        }
    }
}
