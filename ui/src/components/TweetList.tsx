import React from 'react'
import { List } from 'semantic-ui-react'
import { Tweet } from '@daml.js/sane-twitter';
import { useStreamQuery } from '@daml/react';


const TweetList: React.FC = () => {
    const tweets = useStreamQuery(Tweet.Tweet).contracts
    return (
        <List divided relaxed>
            {[...tweets].map(tweet => 
                <List.Item key={tweet.payload.sender}>
                    <List.Content floated='left'>
                        <strong>{tweet.payload.sender}</strong>: {tweet.payload.content}
                    </List.Content>
                </List.Item>
                )}
        </List>
    )
}

export default TweetList