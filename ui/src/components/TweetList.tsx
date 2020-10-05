import React from 'react'
import { List, Button } from 'semantic-ui-react'
import { Tweet } from '@daml.js/sane-twitter';
import { useStreamQuery } from '@daml/react';
import { ContractId, Party } from '@daml/types';

type Props = {
    deletionRequester: Party | undefined;
    deleteOp: (requester: Party, tweetCid: ContractId<Tweet.Tweet>) => Promise<Boolean>;
  }

const TweetList: React.FC<Props> = ({deletionRequester, deleteOp})  => {
    const tweets = useStreamQuery(Tweet.Tweet).contracts
    const proposeDelete = async (tweetCid: ContractId<Tweet.Tweet>, event?: React.FormEvent) => {
        if (event) {
          event.preventDefault();
        }
        if(deletionRequester !== undefined)
          await deleteOp(deletionRequester, tweetCid);
      }
    
    return (
        <List divided relaxed>
            {[...tweets].map(tweet => 
                <List.Item key={tweet.payload.sender}>
                    <List.Content floated='left'>
                        <strong>{tweet.payload.sender}</strong>: <i>"{tweet.payload.content}"</i> <br/>
                        Approved by {JSON.stringify(Object.keys(tweet.payload.reviewers.textMap))}
                    </List.Content>
                    <Button
                        type='submit'
                        className='delete-tweet'
                        onClick={(event) => proposeDelete(tweet.contractId, event)} >
                        Delete
                        </Button>
                </List.Item>
                )}
        </List>
    )
}

export default TweetList