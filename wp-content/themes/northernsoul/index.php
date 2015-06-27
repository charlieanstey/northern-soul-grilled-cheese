<?php get_header(); ?>

	<!-- <div style="height: 50px; background: #f00; width: 50%;"></div> -->
	<section class="box board big-box"> <img class="logo" src="images/logo.a6685845.svg"> <img class="twitter" src="images/twitter.9383c9ac.svg">
		<div class="tagline">
			<h1 class="tagline-gourmet">Gourmet</h1>
			<h1 class="tagline-grilled">Grilled Cheese</h1>
			<h1 class="tagline-soups">Soups 'n' Shakes</h1> </div>
	</section>
	<section class="box black big-box">
		<h1>You have arrived</h1>
		<h2>Welcome to <br>Manchester's premier gourmet grilled cheese <br>pop up. Banging out killer eats and rare beats</h2>
		<h4>#KeepTheFaith</h4> </section>
	<section class="box white small-box">
		<h1 class="dot">Location</h1> </section>
	<section class="box menu small-box">
		<h1 class="dot">Menu</h1> </section>
	<section class="box yellow small-box">
		<h1 class="dot">Social</h1> </section>
	<section class="box black small-box">
		<h1>Are you a big fan of grilled cheese?</h1> </section>
	<section class="box board small-box"></section>

	<?php if ( have_posts() ) : ?>

		<?php if ( is_home() && ! is_front_page() ) : ?>
			<header>
				<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
			</header>
		<?php endif; ?>

		<?php
		// Start the loop.
		while ( have_posts() ) : the_post();

			/*
			 * Include the Post-Format-specific template for the content.
			 * If you want to override this in a child theme, then include a file
			 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
			 */
			get_template_part( 'content', get_post_format() );

		// End the loop.
		endwhile;

		// Previous/next page navigation.
		the_posts_pagination( array(
			'prev_text'          => __( 'Previous page', 'twentyfifteen' ),
			'next_text'          => __( 'Next page', 'twentyfifteen' ),
			'before_page_number' => '<span class="meta-nav screen-reader-text">' . __( 'Page', 'twentyfifteen' ) . ' </span>',
		) );

	// If no content, include the "No posts found" template.
	else :
		get_template_part( 'content', 'none' );

	endif;
	?>

<?php get_footer(); ?>
