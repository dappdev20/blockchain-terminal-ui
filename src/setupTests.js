jest.mock('mathjs/number', () => ({
  round: jest.fn(() => {
    return amt => amt;
  })
}));
