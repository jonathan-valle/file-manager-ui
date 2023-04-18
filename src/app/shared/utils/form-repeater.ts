import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from "@angular/forms";

/**
 * A helper class to wrap the {@link FormArray} with a factory method.
 *
 * It allows to add new items to the {@link FormArray} by calling {@link add}.
 * A new control will be appended to the {@link FormArray} based on the defined factory method.
 * This class will keep in sync underlying controls on following operations:
 * * {@link patchValue}, will create additional controls so that all provided values can be associated to a control
 * * {@link reset}, will remove any control that cannot be associated to one of the provided values
 */
export class FormRepeater extends FormArray {

  /**
   * The factory method that creates the abstract control
   */
  private readonly controlFactory: (value?: any) => AbstractControl;

  /**
   * Instantiates the {@link FormRepeater} and creates the underlying {@link FormArray}.
   *
   * @param value the initial value of the control
   * @param controlFactory the factory method that will be called to create new controls.
   * @param validatorOrOpts the {@link FormArray} validatorOrOpts param
   * @param asyncValidator the {@link FormArray} asyncValidator param
   */
  constructor(
    value: any[],
    controlFactory: (value?: any) => AbstractControl,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super([], validatorOrOpts, asyncValidator);
    this.controlFactory = controlFactory;
  }

  /**
   * Adds a new control to the {@link FormArray} by calling the factory method.
   *
   * @param value the initial value of the control, passed to the factory method.
   * @param options specifies whether this instance should emit events after a new control is added.
   * * emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges
   *   observables emit events with the latest status and value when the control is inserted.
   *   When false, no events are emitted.
   */
  add(value?: any, options?: { emitEvent?: boolean; }) {
    const control = this.controlFactory(value);
    super.push(control, options);
  }

  /**
   * Patches the {@link FormArray} by creating all missing controls first.
   * If the value list has more items than the {@link FormArray} has controls, additional controls are created.
   * If the value list has fewer items than the {@link FormArray} has controls, additional controls are not removed.
   *
   * @param value the list of values
   * @param options the {@link FormArray.patchValue} options
   */
  override patchValue(value: any[], options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    const currentLength = this.length;
    for (let i = currentLength; i < value.length; i++) {
      this.add(undefined, {emitEvent: false});
    }
    super.patchValue(value, options);
  }

  /**
   * Resets the {@link FormArray} by removing all additional controls first.
   * If the value list has more items than the {@link FormArray} has controls, additional controls are not created.
   * If the value list has fewer items than the {@link FormArray} has controls, additional controls are removed.
   *
   * @param value the list of values
   * @param options the {@link FormArray.reset} options
   */
  override reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
    if (value != null) {
      const currentLength = this.length;
      for (let i = currentLength; i > value.length; i--) {
        this.removeAt(i, {emitEvent: false});
      }
    }
    super.reset(value, options);
  }

}
