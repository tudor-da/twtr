# Curated public message feed
This app aims to showcase a curated/sane social network (fully inspired by Twitter) with a public
message board log where messages need to be `curated` before publishing.

##### NOTE: This an ongoing WIP project for means of DAML exploration.

### Design principle
Following the known principle of Twitter, any party can post `messages` (Tweet template). 
However, they can only do so after their tweets are reviewed by someone. Therefore, each entity needs to add reviewers to its account. 
Currently, this is a unilateral action, without requiring the actual consent of the `reviewer`.

#### Publishing a message
Publishing a `tweet` by a `submitter` entails two steps:
1. The `submitter` writes the content of the message and pushes `Send`. 
The result of this action will be a creation of a `TweetProposal` contract which inherits the `submitter`'s reviewers as mandatory signatories
2. Each of the `submitter`'s reviewers sees the `TweetProposal` and needs to approve it.
Once all `reviewers` have approved the content, the `TweetProposal` is consumed and a `Tweet` is being created.

#### Approval automation
For means of simplicity, a `reviewer` could trust the `submitter` well enough and automate the approvals with a trigger.
In this case, the `reviewer` (let's call him Bob here), instantly approves all of the `submitter`'s tweets.
This could model a real-life scenario where the `submitter` has a long running history of _sane_ tweets and doesn't need close monitoring.

#### Message deletion
The historical log of messages can be altered by each of the tweet's _backers_ (signatories).
This would allow an aposteriori retraction of the tweet if any of the parties backing the _claim_ changes its mind.
Of course, if it was a malevolent backer, the `submitter` can just remove him as a reviewer and re-publish the tweet.

### Running it
```
$ daml start && daml codegen js .daml/dist/sane-twitter-0.1.0.dar -o daml.js
$ cd ui && yarn install --frozen-lockfile && yarn start
```

* Example trigger creation for `Bob`:
```
$ daml build
$ daml trigger --dar .daml/dist/sane-twitter-0.1.0.dar --trigger-name Triggers:autoApproveTrigger --ledger-host localhost --ledger-port 6865 --ledger-party Bob
```