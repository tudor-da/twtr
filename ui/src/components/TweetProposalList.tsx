import React from 'react'
import { Button, Divider, List, ListItem } from 'semantic-ui-react';
import { Tweet } from '@daml.js/sane-twitter'
import { useStreamQuery } from '@daml/react';
import { Bool, Party } from '@daml/types';
import { TweetProposal } from '@daml.js/sane-twitter/lib/Tweet';

type Props = {
  newSigner: Party | undefined;
  onNewSigner: (newSigner: Party, tweetProposal: TweetProposal) => Promise<Boolean>;
}

/**
 * React component displaying the list of messages for the current user.
 */
const TweetProposalList: React.FC<Props> = ({newSigner, onNewSigner}) => {
  const messagesResult = useStreamQuery(Tweet.TweetProposal);

  const sign = async (tweetProposal: TweetProposal, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if(newSigner !== undefined)
      await onNewSigner(newSigner, tweetProposal);
  }

  return (
    <List relaxed>
      {messagesResult.contracts.map(tweetProposal => {
        const {signatories, tweet, remainingObservers} = tweetProposal.payload;
        const {sender, reviewers, content} = tweet
        return (
          <ListItem
            className='test-select-message-item'
            key={tweetProposal.contractId}>
            Tweet proposal by <strong> {sender}: </strong> "{content}" <br/>
              Current signatories: <strong>{signatories} </strong> <br/>
              Remaining reviewers: <strong>{remainingObservers}</strong> <br/>
            <Button
              type='submit'
              className='test-select-follow-button'
              onClick={(event) => sign(tweetProposal.payload, event)} >
              Approve tweet
            </Button>
              <Divider/> 
          </ListItem>
        );
      })}
    </List>
  );
};

export default TweetProposalList;