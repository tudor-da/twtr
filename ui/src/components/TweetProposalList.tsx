import React from 'react'
import { Button, Divider, List, ListItem } from 'semantic-ui-react';
import { Tweet } from '@daml.js/sane-twitter'
import { useStreamQuery } from '@daml/react';
import { Party, ContractId } from '@daml/types';
import { TweetProposal } from '@daml.js/sane-twitter/lib/Tweet';

type Props = {
  newSigner: Party | undefined;
  onNewSigner: (newSigner: Party, tweetProposal: ContractId<TweetProposal>) => Promise<Boolean>;
}

/**
 * React component displaying the list of messages for the current user.
 */
const TweetProposalList: React.FC<Props> = ({newSigner, onNewSigner}) => {
  const messagesResult = useStreamQuery(Tweet.TweetProposal);

  const sign = async (tweetProposal: ContractId<TweetProposal>, event?: React.FormEvent) => {
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
        const {sender, content} = tweet
        return (
          <ListItem
            className='test-select-message-item'
            key={tweetProposal.contractId}>
            Tweet proposal by <strong> {sender}: </strong> "{content}" <br/>
              Current signatories: <strong>{JSON.stringify(Object.keys(signatories.textMap))} </strong> <br/>
              Remaining reviewers: <strong>{JSON.stringify(Object.keys(remainingObservers.textMap))}</strong> <br/>
            <Button
              type='submit'
              className='test-select-follow-button'
              onClick={(event) => sign(tweetProposal.contractId, event)} >
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