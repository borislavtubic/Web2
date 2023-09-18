export const GetVerification =  () =>
{
    return localStorage.getItem('verification');
}

export const SetVerification =  (verification) =>
{
    localStorage.setItem('verification', verification);        
}