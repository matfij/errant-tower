type LogSink = {
    error(details: Record<string, unknown>, message: string): void;
};

export class LogService {
    private static sink: LogSink = {
        error() {},
    };

    static error(details: Record<string, unknown>, message: string): void {
        LogService.sink.error(details, message);
    }

    static bind(sink: LogSink): void {
        LogService.sink = sink;
    }
}
