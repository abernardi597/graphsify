import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Stepper, {Step, StepButton, StepContent} from 'material-ui/Stepper';
import Button from 'material-ui/Button';

import IconLibraryMusic from 'material-ui-icons/LibraryMusic';
import IconExplore from 'material-ui-icons/Explore';
import IconSave from 'material-ui-icons/Save';
import IconAdd from 'material-ui-icons/Add';

import TrackList from './list';

const styles = theme => ({
  contentRoot: {
    marginTop: theme.spacing.unit * 2,
    position: 'relative'
  },
  listRoot: {
    overflow: 'auto',
    position: 'relative',
    height: '500px'
  },
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1.5,
    right: theme.spacing.unit * 4
  }
});

class Library extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 0
    };
  }

  render() {
    const {step} = this.state;
    const {active, suggested, fabAdd, classes} = this.props;
    const color = index => step === index ? 'secondary' : 'disabled';
    const changeStep = step => () => {
      this.setState({step});
    };
    return (
      <Stepper nonLinear activeStep={step} orientation="vertical">
        <Step>
          <StepButton onClick={changeStep(0)} icon={<IconLibraryMusic color={color(0)} />}>
            Add songs you know
          </StepButton>
          <StepContent>
            <div className={classes.contentRoot}>
              <div className={classes.listRoot}>
                <TrackList tracks={active}/>
              </div>
              <Button mini variant="fab" color="secondary" onClick={fabAdd} className={classes.button}>
                <IconAdd />
              </Button>
            </div>
          </StepContent>
        </Step>
        <Step>
          <StepButton onClick={changeStep(1)} icon={<IconExplore color={color(1)} />}>
            Explore similar music
          </StepButton>
          <StepContent>
            <div className={classes.listRoot}>
              <TrackList tracks={suggested} />
            </div>
          </StepContent>
        </Step>
        <Step>
          <StepButton onClick={changeStep(2)} icon={<IconSave color={color(2)} />}>
            Save for later
          </StepButton>
          <StepContent>
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}

Library.propTypes = {
  active: PropTypes.array.isRequired,
  suggested: PropTypes.array.isRequired,
  fabAdd: PropTypes.func,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Library);
