-- init
CREATE DATABASE IF NOT EXISTS steem_lookup_v4;

USE steem_lookup_v4;

CREATE TABLE IF NOT EXISTS steem_posts (
    permlink varchar(2000) PRIMARY KEY,
    author varchar(100),
    title varchar(2000),
    author_reputation int,
    created TIMESTAMP,
    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_payout TIMESTAMP,
    tags varchar(2000),
    imageCount int,
    wordCount int,
    body varchar(100000),
    children int,
    active_votes varchar(20000),
    net_votes integer,
    pending_payout_value float,
    lang varchar(20),
    thumbnails varchar(20000)
);

create table IF NOT EXISTS steem_user (
    id int,
    name varchar(300) NOT NULL PRIMARY KEY,
    created TIMESTAMP,
    mined boolean,
    post_count int,
    voting_power int,
    last_vote_time TIMESTAMP,
    balance float,
    savings_balance float,
    sbd_balance float,
    savings_sbd_balance float,
    savings_withdraw_requests int,
    vesting_shares float,
    curation_rewards float,
    last_post TIMESTAMP,
    last_root_post TIMESTAMP,
    vesting_balance float,
    reputation bigint,
    witness_votes varchar(2000),
    json_metadata varchar(20000),
    sl_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table IF NOT EXISTS lookup_user (
    name varchar(100),
    email varchar(100) primary key,
    password varchar(100) not null,
    token varchar(100),
    saved_searches varchar(20000) default null,
    custom_user_list varchar(20000) default null
);
