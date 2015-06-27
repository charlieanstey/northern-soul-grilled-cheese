<?php

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '+f1dC*d|[tk[_,LC(k3|+#?j{U(GwM0Xa-oq+ ZE!o(+bwp/CRznS6e@MLdH(Lia');
define('SECURE_AUTH_KEY',  '5=B|Ve1O[B:*X(pXRRz|#.{N0%r@3~AosAIz-GnwBN0.*QqTDz<fzfPF V6`+B>(');
define('LOGGED_IN_KEY',    '4-jHD-O>W/O3*4$|xjUY.48%:RyE&?AfJS6^Qt]8z.l-;<kZ-7%o)6V*;D/,0}s-');
define('NONCE_KEY',        'sY8$jFhdrC%D+4|T>KNjdq@<S3|xG+=@@i:-;bV,KDz{Lhag,gL)sRB^.!:}9m1?');
define('AUTH_SALT',        '-Y|.1QRKe=lwbull<,RxD];ce4 +kPL2pm|-sI]Mk,B9}HocbZ5vWn15y(k@+%n3');
define('SECURE_AUTH_SALT', 'nxa-_?OoTi{tis)-?+nF2mn~G5-q+KVL+!FqY6G=_%H1R+oRceve+V3gA7{r-kO9');
define('LOGGED_IN_SALT',   '*/a:h(Ej|a~QksdH*I%=n~1=q ]1m4,|!1u0I#$#S,]9bv/(]L*-jb}8Ocm=7kj=');
define('NONCE_SALT',       ':?D^p|!9|4*ty-m`-p]d2=sbx7G05|M6Zy%oQn28;5>fxCS L]/w8p`jzp@3+nF1');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/* Disable WP Cron */
define('DISABLE_WP_CRON', true);