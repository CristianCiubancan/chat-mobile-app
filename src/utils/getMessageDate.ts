export const getMessageDate = (messageDate: any) => {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(parseInt(messageDate));
  const day = parseInt(date.toISOString().split("-")[2]);
  const month = months[date.getMonth() - 1];
  const dateNow = new Date();
  const elapsedTime = dateNow.getTime() - date.getTime();
  const result =
    elapsedTime > 86400000
      ? `${day} ${month}`
      : `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }`;
  return result;
};
