//go:build windows

package exec

import (
	"syscall"
)

func GetSysProcAttr() *syscall.SysProcAttr {
	// This prevents the console window from appearing when running the command,
	// since we do not want it flashing when the exec plugin is running.
	return &syscall.SysProcAttr{
		HideWindow: true,
	}
}
