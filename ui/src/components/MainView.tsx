// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { Tweet, User } from '@daml.js/sane-twitter';
import { useParty, useLedger, useStreamFetchByKey, useStreamQuery } from '@daml/react';
import PartyListEdit from './PartyListEdit';
import TweetEdit from './TweetEdit'
import TweetProposalList from './TweetProposalList'
import { TweetProposal, TweetProposal_Sign } from '@daml.js/sane-twitter/lib/Tweet';

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = useParty();
  const myUserResult = useStreamFetchByKey(User.User, () => username, [username]);
  const myUser = myUserResult.contract?.payload;
  const allUsers = useStreamQuery(User.User).contracts;
// USERS_END

  // Sorted list of users that are reviewers of the current user
  const reviewers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);

  // FOLLOW_BEGIN
  const ledger = useLedger();

  const addReviewer = async (reviewer: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.AddReviewer, username, {reviewer});
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const reviewerSign = async (newSigner: Party, tweetProposal: TweetProposal): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(Tweet.TweetProposal.TweetProposal_Sign, tweetProposal, {newSigner});
      return true;
    } catch (error) {
      alert("Unknown error while trying to sign proposal:\n" + JSON.stringify(error));
      return false;
    }
  }
  // FOLLOW_END

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUser ? `Welcome, ${myUser.username}!` : 'Loading...'}
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUser?.username ?? 'Loading...'}
                  <Header.Subheader>My reviewers</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.reviewers ?? []}
                onAddParty={addReviewer}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='pencil square' />
                <Header.Content>
                  Tweets
                  <Header.Subheader>Publish tweet</Header.Subheader>
                </Header.Content>
              </Header>
              <TweetEdit />
            </Segment>
            <Segment>
              <Header as='h3'>
                <Header.Content>
                  Tweet proposals
                  <Header.Subheader>Tweets pending publishing</Header.Subheader>
                </Header.Content>
              </Header>
              <TweetProposalList
              newSigner={username}
              onNewSigner={reviewerSign}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
