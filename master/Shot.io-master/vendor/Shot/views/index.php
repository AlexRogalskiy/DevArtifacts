<?php include 'header.php' ?>

<script>
	SHOT.albums = <?= json_encode($this->albums) ?>;
</script>

<div class="row">
	<div class="large-12 columns">
		<ul class="thumbnail-grid"></ul>

		<p class="page-placeholder">
			No albums have been created yet
		</p>
	</div>
</div>

<?php include 'templates/album.php' ?>
<?php include 'templates/docks/albums.php' ?>
<?php include 'templates/modals/albums/create.php' ?>

<?php include 'footer.php' ?>
