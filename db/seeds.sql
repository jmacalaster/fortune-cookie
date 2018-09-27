SELECT * FROM fortunes;

INSERT INTO 
    users(name, address, platform, createdAt, updatedAt)
    VALUES
    ('Julia', '@jmac', 'Slack', NOW(), NOW()),
    ('Kenneth', '@kpostigo', 'Slack', NOW(), NOW()),
    ('Evan', '@Evan', 'Slack', NOW(), NOW()),
    ('Sandy', '@Sandy_Yeung', 'Slack', NOW(), NOW());

INSERT INTO 
    fortunes(text, isRead, createdAt, updatedAt, fromUserID)
    VALUES
    ('Fortune Not Found: Abort, Retry, Ignore?', false, NOW(), NOW(), 1),
    ('About time I got out of that cookie', false, NOW(), NOW(), 2),
    ('The early bird gets the worm, but the second mouse gets the cheese', false, NOW(), NOW(), 3),
    ('Be on alert to recognize your prime at whatever time of your life it may occur', false, NOW(), NOW(), 4),
    ('Your road to glory will be rocky, but fulfilling', false, NOW(), NOW(), 2),
    ('Courage is not simply one of the virtues, but the form of every virtue at the testing point', false, NOW(), NOW(), 1);



