const option = ({page, limit}) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return {
    page: pageNumber,
    limit: limitNumber,
  };
};

export default option;
