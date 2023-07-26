/** This module is deprecated as its name was pluralized.
 * Use the priorityClass module instead. */
// @todo Remove this module when appropriate.
import PriorityClass, { KubePriorityClass } from './priorityClass';
export * from './priorityClass';
export type KubePriorityClasses = KubePriorityClass;
export default PriorityClass;
