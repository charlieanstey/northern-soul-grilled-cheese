<?php

if (!defined('APPLICATION_ENVIRONMENT'))
{
	/** Which environment are we on? */
	if(!getenv('APPLICATION_ENVIRONMENT'))
	{
		define('APPLICATION_ENVIRONMENT', 'production');
	}
	else
	{
		define('APPLICATION_ENVIRONMENT', getenv('APPLICATION_ENVIRONMENT'));
	}
}


/** Load up environment-specific stuff */
switch(APPLICATION_ENVIRONMENT)
{
	case 'local':
		require_once(ABSPATH . 'wp-config.local.php');
	break;

	case 'staging':
		require_once(ABSPATH . 'wp-config.staging.php');
	break;

	default:
		require_once(ABSPATH . 'wp-config.production.php');
	break;
}