//go:build !windows

package exec

import (
	"syscall"
)

func GetSysProcAttr() *syscall.SysProcAttr {
	// Nothing here since it's not needed. It's just for keeping the
	// multi-platform code working.
	return nil
}
