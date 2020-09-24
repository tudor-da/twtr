import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { User } from '@daml.js/sane-twitter';
import { useParty, useLedger } from '@daml/react';

type Props = {}

/**
 * React component to edit a message to send to a follower.
 */
const TweetEdit: React.FC<Props> = () => {
  const sender = useParty();
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const ledger = useLedger();

  const submitTweet = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      await ledger.exerciseByKey(User.User.PublishTweet, sender, {content});
      setContent("");
    } catch (error) {
      alert(`Error sending message:\n${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submitTweet}>
      <Form.Input
        className='test-select-message-content'
        placeholder="Write a message"
        value={content}
        onChange={event => setContent(event.currentTarget.value)}
      />
      <Button
        fluid
        className='test-select-message-send-button'
        type="submit"
        disabled={isSubmitting || content === ""}
        loading={isSubmitting}
        content="Send"
      />
    </Form>
  );
};

export default TweetEdit;