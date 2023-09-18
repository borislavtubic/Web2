export const itemModel = ({
    name: '',
    price: -1,
    amount: -1,
    description: '',
    picture: '',
    sellerId: -1,
  });
export const GetItem =  () =>
{
    return JSON.parse(localStorage.getItem('item'));
}

export const SetItem =  (item) =>
{
    localStorage.setItem('item', JSON.stringify(item));
}

export const SetBasket =  (basket) =>
{
    localStorage.setItem('basket', JSON.stringify(basket));
}

export const GetBasket =  () =>
{
    return JSON.parse(localStorage.getItem('basket'));
}