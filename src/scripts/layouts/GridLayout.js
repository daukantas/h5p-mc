import PopupLayout from './PopupLayout';
import Options from '../Options';
import Dictionary from '../Dictionary';

const $ = H5P.jQuery;

class HeaderButton extends H5P.EventDispatcher {

  constructor() {
    super();
    var self = this;

    var state = 'skip';

    // Create dom element
    var $action = $('<a>', {
      'class': 'header-button skip-lesson',
      'text': Dictionary.get('skipLabel'),
      click: function () {
        self.trigger(state);
      }
    });

    self.getDomElement = function () {
      return $action;
    };

    self.setState = function (newState) {
      state = newState;
      $action.toggleClass('h5p-joubelui-button continue', state === 'continue')
        .toggleClass('skip-lesson', state === 'skip')
        .text(state === 'skip' ? Dictionary.get('skipLabel') : Dictionary.get('continueLabel'));
    };

    self.skip = function () {
      self.setState('skip');
    };

    self.continue = function () {
      self.setState('continue');
    };
  }
}

class UnitHeader {

  constructor(maxScore) {

    var self = this;
    // States: ready, completed
    var hasScore = !!maxScore;

    var $element = $('<div>', {
      'class': 'h5p-mini-course-unit-header'
    });

    var $label = $('<div>', {
      'class': 'h5p-mini-course-unit-header-label'
    }).appendTo($element);

    var $value = $('<div>', {
      'class': 'h5p-mini-course-unit-header-value'
    }).appendTo($element);

    self.getDomElement = function () {
      return $element;
    };

    self.setState = function (state, score) {
      $label.text(hasScore ? (state === 'ready' ? Dictionary.get('maxScoreLabel') : Dictionary.get('youGotLabel')) : Dictionary.get('infoLessonLabel'));
      $value.text(hasScore ? (state === 'ready' ? maxScore + ' points' : score + ' of ' + maxScore + ' points') : Dictionary.get('infoLessonValue'));
    };

    // Initial setups
    self.setState('ready');
  }
}
export default class GridLayout extends PopupLayout {

  constructor() {
    super();

    this.minimumWidth = Options.all().layout.minimumWidth;

    this.$grid = $('<div>', {
      'class': 'h5p-grid h5p-units'
    });


    this.$unitPanel = $('<div>', {
      'class': 'h5p-mini-course-unit-panel locked'
    });


  }

  getElement() {
    return this.$grid;
  }

  add(courseUnit) {
    super.add(courseUnit);
    //courseUnit.appendTo(this.$grid);
    //
    this.$unitPanelInner = $('<div>', {
      'class': 'h5p-mini-course-unit-panel-inner ' + courseUnit.getMachineName(),
      tabIndex: 0
    }).appendTo(this.$unitPanel);

    var unitHeader = new UnitHeader(self.getMaxScore());
    unitHeader.getDomElement().appendTo(this.$unitPanelInner);

    $('<div>', {
      'class': 'h5p-mini-course-unit-title',
      html: courseUnit.getHeader()
    }).appendTo(this.$unitPanelInner);

    $('<div>', {
      'class': 'h5p-mini-course-unit-intro',
      html: courseUnit.getIntro()
    }).appendTo(this.$unitPanelInner);

    this.$beginButton = $('<button>', {
      'class': 'h5p-mini-course-unit-begin',
      html: Dictionary.get('lessonLockedLabel'),
      disabled: 'disabled',
      click: () => {
        this.show();
      }
    }).appendTo(this.$unitPanelInner);
  }

  resize(width) {
    var columns = Math.floor(width / this.minimumWidth);
    columns = (columns === 0 ? 1 : columns);

    // If more place, and single row, fill it up
    if (columns > this.courseUnits.length) {
      columns = this.courseUnits.length;
    }

    var columnsWidth = Math.floor(100 / columns);

    // iterate course units:
    //var widestUnit = 0;
    this.courseUnits.forEach(function (unit) {
      unit.setWidth(columnsWidth);
    });
  }

  reset() {
    // Reset all units
    this.courseUnits.forEach(function (unit) {
      unit.reset();
    });

    // Enable first unit:
    this.courseUnits[0].enable();
  }
}