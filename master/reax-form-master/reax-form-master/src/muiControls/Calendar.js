import React from 'react';
import PropTypes from 'prop-types';
import { startCase, map, range, random, sample } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';

import BackIcon from 'muicons/ChevronLeft';
import ForwardIcon from 'muicons/ChevronRight';
import MoreIcon from 'muicons/ChevronDown';

import moment from 'moment-timezone';

export const Day = ({ children, moment }) => ( //eslint-disable-line
    <div>
        {children}
    </div>
);

@withStyles(theme => ({
    root: {
    },
    week: {
        padding: 0,
    },
    pointer: {
        cursor: 'pointer',
    },
    day: {
        width: `${100/7}%`,
        textAlign: 'center',
    },
    dayBody: {
        '&:hover': {
            backgroundColor: '#ccc',
        },
    },
    dayContent: {
        position: 'relative',
    },
    content: {
        width: '100%',
        height: '16px',
        marginTop: '-10px',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '24px',
        textAlign: 'center',
    },
    monthAndYear: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    yearSelectorIcon: {
        width: '24px',
        height: '24px',
    },
    borderedTop: {
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
    borderedRight: {
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    },
    borderedBottom: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    borderedLeft: {
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    },
}))
export default class Calendar extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
        classes: PropTypes.object.isRequired,
        locale: PropTypes.string,
        weekStartOnSunday: PropTypes.bool,
        availableYears: PropTypes.array,
        //range: disable every outer day
        currentDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
        highlightCurrentDate: PropTypes.bool, //no bool but hexadecimal string with color
        highlightCurrentDateColor: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        weekStartOnSunday: false,
        highlightCurrentDate: true,
        highlightCurrentDateColor: '#ccc',
    };

    state = {
        showYearSelect: false,
    };

    componentWillMount = () => {
        const { locale, currentDate } = this.props;

        if(locale)
            moment.locale(locale);

        const currentTime = currentDate ? currentDate.clone() : moment();

        this.setState({ moment, currentTime, showYearSelect: false });
    };

    previousMonth = () => {
        const { currentTime } = this.state;
        currentTime.subtract({ months: 1 });
        this.setState({ currentTime });
    };

    nextMonth = () => {
        const { currentTime } = this.state;
        currentTime.add({ months: 1 });
        this.setState({ currentTime });
    };

    showYearSelect = showYearSelect => () => {
        this.setState({ showYearSelect });
    };

    selectYear = year => {
        const { currentTime } = this.state;
        currentTime.set({ year });
        this.showYearSelect(false)();
    };

    onChange = value => () => {
        const { onChange }= this.props;
        onChange(value);
    };

    render = () => {
        const { classes, weekStartOnSunday, availableYears, highlightCurrentDate, highlightCurrentDateColor } = this.props;
        const { moment, currentTime, showYearSelect } = this.state;

        const weeks = splitMonthInWeeks(moment, currentTime, weekStartOnSunday);
        const weekDaysMap = weekStartOnSunday ? [0,1,2,3,4,5,6] : [1,2,3,4,5,6,7];
        const weekDays = weekDaysMap.map(value => moment.weekdaysShort(value));

        const years = availableYears || (current => {
            const since = current.clone().subtract({ years: 75 });
            const until = current.clone().add({ years: 10 });

            const years = [];
            while(until.isSameOrAfter(since)) {
                years.push(until.format('YYYY'));
                until.subtract({ years: 1 });
            }
            return years;
        })(moment());

        const highlightStyles = { backgroundColor: highlightCurrentDateColor };

        return (
            <Paper>
                <Grid container={true} spacing={0} justify={'center'} alignContent={'center'} alignItems={'center'}>
                    <Grid item={true} xs={2} className={classes.left}>
                        <IconButton className={classes.pointer} onClick={this.previousMonth}>
                            <BackIcon />
                        </IconButton>
                    </Grid>
                    <Grid item={true} xs={5}>
                        <Typography type={'title'} align={'center'}>
                            {startCase(currentTime.format('MMMM'))}
                        </Typography>
                    </Grid>
                    <Grid item={true} xs={3} className={cx(classes.monthAndYear)}>
                        <div style={{ display: 'hidden' }} ref={ref => this.yearRef = ref} />
                        <Typography className={cx(classes.pointer)} type={'title'} align={'left'} onClick={this.showYearSelect(true)}>
                            {currentTime.format('YYYY')}
                        </Typography>
                        <IconButton className={cx(classes.yearSelectorIcon)} onClick={this.showYearSelect(true)}>
                            <MoreIcon />
                        </IconButton>
                    </Grid>
                    <Grid item={true} xs={2} className={classes.right}>
                        <IconButton className={classes.pointer} onClick={this.nextMonth}>
                            <ForwardIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container={true} alignContent={'center'} alignItems={'center'} justify={'flex-end'}>
                    { map(weekDays, (day, index) => (
                    <Grid key={index} item={true} className={cx(classes.day, classes.dayHeader)}>
                        <Typography align={'center'}>{startCase(day)}</Typography>
                    </Grid>
                    )) }
                </Grid>
                { map(weeks, (week, weekIndex) => (
                <Grid key={weekIndex} container={true} alignContent={'center'} alignItems={'center'} justify={weekIndex < 1 ? 'flex-end' : 'flex-start'} className={cx(classes.week)}>
                    { map(week, (day, dayIndex) => (
                    <Grid key={dayIndex} item={true} style={highlightCurrentDate && day.isSame(currentTime, 'day') ? highlightStyles : {}}
                    className={cx(classes.day, classes.dayBody, classes.pointer, {
                        [classes.borderedTop]: !weekIndex || (weekIndex === 1 && dayIndex < (7 - weeks[0].length)),
                        [classes.borderedBottom]: weekIndex < (weeks.length - 1),
                        [classes.borderedLeft]: !weekIndex && !dayIndex && week.length < 7,
                        [classes.borderedRight]: (dayIndex !== (week.length - 1)) || (dayIndex === week.length - 1 && weekIndex === weeks.length - 1),
                    })} onClick={this.onChange(day)}>
                        <Typography className={cx(classes.dayContent)} align={'center'}>{day.format('D')}</Typography>
                    </Grid>
                    )) }
                </Grid>
                )) }

                <Menu anchorEl={this.yearRef} open={showYearSelect} onClose={this.showYearSelect(false)} style={{ maxHeight: '50vh' }}>
                    {map(years, year => <MenuItem key={year} onClick={() => this.selectYear(year)}>{year}</MenuItem>) }
                </Menu>
            </Paper>
        );
    }
}

const getMonthStart = (moment, month) => {
    const time = month instanceof moment ? month.clone() : moment().set({ month });
    return time.startOf('month');
};

const getMonthEnd = (moment, month) => {
    const time = month instanceof moment ? month.clone() : moment().set({ month });
    return time.endOf('month');
};

const splitMonthInWeeks = (moment, month, weekStartOnSunday) => {
    const time = month instanceof moment ? month.clone() : moment().set({ month });
    const monthStart = getMonthStart(moment, time);
    const monthEnd = getMonthEnd(moment, time);

    let days = [];
    let weeks = [];
    let week = [];

    for(const current = monthStart.clone(); current.isBefore(monthEnd); current.add({ days: 1 })) {
        const day = current.clone();
        days.push(day);
        week.push(day);

        const lastWeekDay = weekStartOnSunday ? 6 : 7;

        //if last week day then reset weekrow
        if(day.isoWeekday() === lastWeekDay) {
            weeks.push(week);
            week = [];
        }
    }

    if(week.length)
        weeks.push(week);

    // for(let week of weeks)
    //     week.forEach(day => console.log(day.toString()))

    return weeks;
};