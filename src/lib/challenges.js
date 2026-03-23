const challenges = [
  {
    id: "challenge-5k",
    label: "5K Challenge",
    accountSize: 5000,
    price: 4999,
    currency: "INR",
    profitTarget: 8,
    maxDrawdown: 10,
    dailyLoss: 5,
    tagline: "Perfect for traders testing a disciplined evaluation workflow.",
  },
  {
    id: "challenge-10k",
    label: "10K Challenge",
    accountSize: 10000,
    price: 7999,
    currency: "INR",
    profitTarget: 8,
    maxDrawdown: 10,
    dailyLoss: 5,
    tagline: "Balanced risk and reward for serious traders scaling capital.",
  },
  {
    id: "challenge-25k",
    label: "25K Challenge",
    accountSize: 25000,
    price: 14999,
    currency: "INR",
    profitTarget: 8,
    maxDrawdown: 10,
    dailyLoss: 5,
    tagline: "Premium capital access for high-conviction funded trading.",
  },
];

export const challengeCatalog = challenges;

export function getChallengeById(challengeId) {
  return challenges.find((challenge) => challenge.id === challengeId);
}

export function getChallengeByAccountSize(accountSize) {
  return challenges.find(
    (challenge) => Number(challenge.accountSize) === Number(accountSize),
  );
}
