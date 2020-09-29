// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Form, List, Button } from 'semantic-ui-react';
import { Party } from '@daml/types';
import pkgcd314fc519b9e3528f46c92658d77c63f80d1a209f67319f2ece231cf38c79df from '@daml.js/cd314fc519b9e3528f46c92658d77c63f80d1a209f67319f2ece231cf38c79df'


type Props = {
  parties: pkgcd314fc519b9e3528f46c92658d77c63f80d1a209f67319f2ece231cf38c79df.DA.Next.Set.Set<Party>;
  onAddParty: (party: Party) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const PartyListEdit: React.FC<Props> = ({parties, onAddParty}) => {
  const [newParty, setNewParty] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addParty = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onAddParty(newParty);
    setIsSubmitting(false);
    if (success) {
      setNewParty('');
    }
  }

  return (
    <List relaxed>
      {[...Object.keys(parties.textMap)].sort((x, y) => x.localeCompare(y)).map((party) =>
        <List.Item
          key={party}
        >
          <List.Icon name='user outline' />
          <List.Content>
            <List.Header className='test-select-following'>
              {party}
            </List.Header>
          </List.Content>
        </List.Item>
      )}
      <br />
      <Form onSubmit={addParty}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          loading={isSubmitting}
          className='test-select-follow-input'
          placeholder="User to review your tweets"
          value={newParty}
          onChange={(event) => setNewParty(event.currentTarget.value)}
        />
        <Button
          type='submit'
          className='test-select-'>
          Add reviewer
        </Button>
      </Form>
    </List>
  );
};

export default PartyListEdit;
