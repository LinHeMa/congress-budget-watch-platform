import { create } from 'zustand';

type VoteState = {
  votes: Record<string, string>;
  actions: {
    setVote: (proposalId: string, vote: string) => void;
  };
};

export const useVoteStore = create<VoteState>((set) => ({
  votes: {},
  actions: {
    setVote: (proposalId, vote) =>
      set((state) => ({
        votes: {
          ...state.votes,
          [proposalId]: vote,
        },
      })),
  },
}));

export const useVotes = () => useVoteStore((state) => state.votes);
export const useVoteActions = () => useVoteStore((state) => state.actions);
