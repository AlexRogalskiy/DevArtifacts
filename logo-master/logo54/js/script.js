var fm_opts     = { delay: 0.5 },
    fm_fromOpts = { drawSVG: '0' },
    fm_toOpts   = { drawSVG: '100% 0', 'visibility': 'visible' },
		fmtl        = new TimelineMax(fm_opts),
    fm_path     = document.querySelectorAll('.fm-logo path'),
    fm_circle   = document.querySelectorAll('.fm-logo circle');

fmtl.staggerFromTo(fm_path, 0.375, fm_fromOpts, fm_toOpts, 0.375)
    .to(fm_circle, 1, { fill: '#E0D252' });