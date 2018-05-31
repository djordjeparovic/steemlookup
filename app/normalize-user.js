'use strict';

require('datejs');

module.exports = (o) => {
    const id = `${o.id}`;
    const name = o.name;
    const created = Date.parse(o.created).toString('yyyy-MM-dd HH:mm:ss+00');
    const mined = o.mined;
    const post_count = o.post_count;
    const voting_power = o.voting_power;
    const last_vote_time = Date.parse(o.last_vote_time).toString('yyyy-MM-dd HH:mm:ss+00');
    const balance = parseFloat(o.balance);
    const savings_balance = parseFloat(o.savings_balance);
    const sbd_balance = parseFloat(o.sbd_balance);
    const savings_sbd_balance = parseFloat(o.savings_sbd_balance);
    const savings_withdraw_requests = o.savings_withdraw_requests;
    const vesting_shares = parseFloat(o.vesting_shares);
    const curation_rewards = parseFloat(o.curation_rewards);
    const last_post = Date.parse(o.last_post).toString('yyyy-MM-dd HH:mm:ss+00');
    const last_root_post = Date.parse(o.last_root_post).toString('yyyy-MM-dd HH:mm:ss+00');
    const vesting_balance = parseFloat(o.vesting_balance);
    const reputation = parseInt(o.reputation);
    const witness_votes = (o.witness_votes || []).join('|');
    const json_metadata = `${o.json_metadata}`;

    return {
        id,
        name,
        created,
        mined,
        post_count,
        voting_power,
        last_vote_time,
        balance,
        savings_balance,
        sbd_balance,
        savings_sbd_balance,
        savings_withdraw_requests,
        vesting_shares,
        curation_rewards,
        last_post,
        last_root_post,
        vesting_balance,
        reputation,
        witness_votes,
        json_metadata
    }
};
