import * as React from 'react';
import { GithubPicker, ColorResult } from 'react-color';
import Store from '../../common/storage';

interface IProps extends React.Props<InputBeforeDays> { 
  beforeDaysColor: Store.IBeforeDaysColor;
  onChange?: (beforeDaysColor: Store.IBeforeDaysColor) => void;
}

interface IState { 
  displayColorPicker?: boolean;
  colorStyles?: React.CSSProperties;
  beforeDaysColor?: Store.IBeforeDaysColor;
}

const contentsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

const inputStyles: React.CSSProperties = {
  marginRight: '8px'
};

const colorWrapper: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px'
};

const colorPickerStyles: React.CSSProperties = {
  position: 'absolute',
  top: '24px',
  left: '72px',
  zIndex: 100
};

const colorDefaultStyles: React.CSSProperties = {
  width: '100px',
  height: '16px',
  marginLeft: '8px',
  border: '1px solid #000000'
};

export default class InputBeforeDays extends React.Component<IProps, IState> { 
  constructor(props: IProps) { 
    super(props);
    this.state = {
      displayColorPicker: false,
      colorStyles: colorDefaultStyles,
      beforeDaysColor: props.beforeDaysColor
    };
  }

  private handleClickColorPicker(): void { 
    if (this.state.displayColorPicker) {
      this.handleColorPickerClose();
    } else { 
      this.handleColorPickerOpen();
    }
  }

  private handleColorPickerOpen(): void { 
    this.setState({
      displayColorPicker: true
    });
  }

  private handleColorPickerClose(): void {
    this.setState({
      displayColorPicker: false
    });
  }

  private handleChangeBeforeDays(e: Event): void {
    this.state.beforeDaysColor!.beforeDays = +(e.currentTarget as HTMLInputElement).value;
    this.setState({
      beforeDaysColor: this.state.beforeDaysColor
    });
    this.props.onChange && this.props.onChange(this.state.beforeDaysColor!);
  }

  private handleChange(color: ColorResult): void {
    const styles = {
      ...colorDefaultStyles,
      backgroundColor: this.createRGBA(color.rgb)
    };
    this.state.beforeDaysColor!.color = color.rgb;
    this.setState({
      beforeDaysColor: this.state.beforeDaysColor,
      colorStyles: styles
    });
  }

  private createRGBA(rgba: Store.IColor): string { 
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a == null ? 1 : rgba.a})`;
  }

  private handleChangeComplete(color: ColorResult): void {
    this.handleChange(color);
    this.handleColorPickerClose();
    this.props.onChange && this.props.onChange(this.state.beforeDaysColor!);
  }

  public getData(): Store.IBeforeDaysColor { 
    return this.state.beforeDaysColor!;
  }

  public render(): JSX.Element {
    const styles = {
      ...colorDefaultStyles,
      backgroundColor: this.createRGBA(this.state.beforeDaysColor!.color)
    };
    return (
      <div style={contentsStyles}>
        <input
          type="number"
          style={inputStyles}
          onChange={this.handleChangeBeforeDays.bind(this)}
          value={this.state.beforeDaysColor!.beforeDays} />
        <span>before days</span>
        <div style={colorWrapper}>
          color: 
          <div
            style={styles}
            onClick={this.handleClickColorPicker.bind(this)}
          >
          </div>
          {
            this.state.displayColorPicker ?
              <div style={colorPickerStyles}>
                <GithubPicker
                  color={this.state.beforeDaysColor!.color}
                  onChange={this.handleChange.bind(this)}
                  onChangeComplete={this.handleChangeComplete.bind(this)}
                />
              </div>  
              :
              null
          }
        </div>
      </div>
    );
  }
}