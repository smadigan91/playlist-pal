from ..logging.logger import log


class BaseWebAppError(Exception):

    def __init__(self, message: str, status_code: int, cause: Exception = None):
        super().__init__(message)
        self._msg = message
        self._cause = cause
        self._status_code = status_code
        self._log()

    @property
    def message(self):
        return self._msg

    @property
    def cause(self):
        return self._cause

    @property
    def status_code(self):
        return self._status_code

    def _log(self):
        if self.cause:
            log.error(self.message, exc_info=self.cause)
        else:
            log.error(self.message)


class SpotifyError(BaseWebAppError):

    def __init__(self, message, status_code = 400, cause = None):
        super().__init__(f"Spotify error: {message}", status_code, cause)


class DatabaseError(BaseWebAppError):

    def __init__(self, message, status_code = 500, cause = None):
        super().__init__(f"Database error: {message}", status_code, cause)
