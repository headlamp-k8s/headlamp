import Registry from './registry';
export declare abstract class Plugin {
    abstract initialize(register: Registry): boolean;
}
declare global {
    interface Window {
        pluginLib: {
            [libName: string]: any;
        };
        plugins: {
            [pluginId: string]: Plugin;
        };
        registerPlugin: (pluginId: string, pluginObj: Plugin) => void;
    }
}
