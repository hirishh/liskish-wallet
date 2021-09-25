import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import store from '../../store';
import VotingRow from './votingRow';

describe('VotingRow', () => {
  const votedStatus = { confirmed: true, unconfirmed: true, publicKey: 'sample_key' };
  const voteStatus = { confirmed: false, unconfirmed: true, publicKey: 'sample_key' };
  const unvoteStatus = { confirmed: true, unconfirmed: false, publicKey: 'sample_key' };
  const pendingStatus = { confirmed: true, unconfirmed: true, pending: true, publicKey: 'sample_key' };
  const props = {
    data: {
      rank: 1,
      username: 'genesis_17',
      account: {
        address: '16313739661670634666L',
      },
    },
    voteToggled: () => {},
  };
  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  it('should TableRow has class name of "pendingRow" when props.data.pending is true', () => {
    const wrapper = mount(<VotingRow {...props} voteStatus={pendingStatus}></VotingRow>, options);
    const expectedClass = '_pendingRow';
    const className = wrapper.find('tr').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it(`should TableRow has class name of "votedRow" when voteStatus.unconfirmed and
    confirmed are true`, () => {
      const wrapper = mount(<VotingRow {...props} voteStatus={votedStatus}></VotingRow>, options);
      const expectedClass = '_votedRow';
      const className = wrapper.find('tr').prop('className');
      expect(className).to.contain(expectedClass);
    });

  it(`should TableRow has class name of "downVoteRow" when voteStatus.unconfirmed is false
    but confirmed is true`, () => {
      const wrapper = mount(<VotingRow {...props} voteStatus={unvoteStatus}></VotingRow>, options);
      const expectedClass = '_downVoteRow';
      const className = wrapper.find('tr').prop('className');
      expect(className).to.contain(expectedClass);
    });

  it(`should TableRow has class name of "upVoteRow" when voteStatus.unconfirmed is false
    but confirmed is true`, () => {
      const wrapper = mount(<VotingRow {...props} voteStatus={voteStatus}></VotingRow>, options);
      const expectedClass = '_upVoteRow';
      const className = wrapper.find('tr').prop('className');
      expect(className).to.contain(expectedClass);
    });
});
