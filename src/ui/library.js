import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

import Stepper, {Step, StepButton, StepContent} from 'material-ui/Stepper';

import IconLibraryMusic from 'material-ui-icons/LibraryMusic';
import IconExplore from 'material-ui-icons/Explore';
import IconSave from 'material-ui-icons/Save';

import List from './list';

const styles = {
};

class Library extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 0
    };
  }

  render() {
    const {step} = this.state;
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
            <List tracks={this.props.active} />
          </StepContent>
        </Step>
        <Step>
          <StepButton onClick={changeStep(1)} icon={<IconExplore color={color(1)} />}>
            Explore similar music
          </StepButton>
          <StepContent>
            <List tracks={this.props.suggested} />
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Library);
