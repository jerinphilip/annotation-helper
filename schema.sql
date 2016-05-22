
drop table if exists entries;

create table entries (
    id integer primary key autoincrement,
    word string not null,
    split_word string not null,
    split_location string not null,
    lang string not null
);

drop table if exists rules;
create table rules (
    id integer primary key autoincrement,
    x string not null,
    y string not null,
    xt string not null,
    yt string not null,
    lang string not null
);

