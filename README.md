



```
create table lookup_user (
    name varchar(100),
    email varchar(100) primary key,
    password varchar(100) not null,
    token varchar(100),
    saved_searches varchar(20000) default null,
    custom_user_list varchar(20000) default null
);
```
