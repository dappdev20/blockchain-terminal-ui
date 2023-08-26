import uuidv4 from 'uuid/v4';
import * as Sentry from '@sentry/browser';

/**
 * Purpose: wrapper for Sentry React client that helps to maintain context across callbacks and callback-like patterns
 * (i.e. eventListeners)
 *
 * Author: Sam Rahimi (samrahimi420@gmail.com)
 */
class TaskStateTracker {
  constructor(sentryCli) {
    this.pendingOperations = {};
    this.sentry = sentryCli;
    window.__LP = this;
  }

  beginOperation(descriptiveLogData) {
    const uuid = uuidv4();
    this.pendingOperations[uuid] = { data: descriptiveLogData, start: Date.now(), unique_id: uuid, status: 'started' };
    return uuid;
  }

  endOperation(uuid, responseState) {
    const op = this.pendingOperations[uuid];
    if (op.status !== 'started') {
      console.error(`${uuid}: each startOperation must have exactly 1 endOperation or failOperation`);
      delete op[uuid];
      return false;
    }

    op.end = Date.now();
    op.response = responseState || {};
    op.duration = op.end - op.start;
    op.status = 'finished';

    Sentry.withScope(scope => {
      scope.setLevel('info');
      scope.setTags({
        event_category: 'endOperation',
        description: op.data,
        uuid,
        duration_in_ticks: op.duration,
        status: op.status
      });
      scope.setExtra('all_data', op);
      Sentry.captureMessage(`END ${op.data}`);
    });
  }

  // Pulls a running, completed, or failed operation from memory
  // uuid: identifies the operation, is returned by beginOperation
  getOperationStateById(uuid) {
    return this.pendingOperations[uuid] || null;
  }

  failOperation(uuid, err) {
    const op = this.pendingOperations[uuid];
    if (op.status !== 'started') {
      console.error(`${uuid}: each beginOperation and failOperation must have a matching startOperation`);
      // delete op[uuid];
      return false;
    }

    op.err = err;
    op.status = 'error';
    Sentry.withScope(scope => {
      scope.setLevel('error');
      scope.setTags({ event_category: 'failOperation', description: op.data, uuid, status: op.status });
      Sentry.captureException(err);
    });
  }

  logError(err) {
    const uuid = uuidv4();

    Sentry.withScope(scope => {
      scope.setLevel('error');
      scope.setTags({ event_category: 'logError', uuid, status: 'error' });
      Sentry.captureException(err);
    });
  }

  log(somethingToLog) {
    const uuid = uuidv4();
    Sentry.withScope(scope => {
      scope.setLevel('info');
      scope.setTags({ event_category: 'logInfo', uuid });
      scope.captureMessage(somethingToLog);
    });
  }
}
export const taskStateTracker = new TaskStateTracker();
