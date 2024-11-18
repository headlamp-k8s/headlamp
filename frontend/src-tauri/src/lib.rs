use tauri::Manager;
use tauri_plugin_shell::ShellExt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let sidecar_command = app
                .app_handle()
                .shell()
                .sidecar("headlamp-server")
                .unwrap()
                .args(["-dev", "-enable-dynamic-clusters"]);

            let handle = tauri::async_runtime::spawn(async move {
                sidecar_command.spawn().expect("Failed to spawn sidecar");
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
