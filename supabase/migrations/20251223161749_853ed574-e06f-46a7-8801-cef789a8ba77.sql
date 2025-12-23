-- Add restrictive policies to prevent UPDATE and DELETE on admin_logs
-- This preserves audit log integrity and accountability

-- Policy to deny all UPDATE operations on admin_logs
CREATE POLICY "No updates allowed on admin logs"
ON public.admin_logs
AS RESTRICTIVE
FOR UPDATE
USING (false);

-- Policy to deny all DELETE operations on admin_logs
CREATE POLICY "No deletes allowed on admin logs"
ON public.admin_logs
AS RESTRICTIVE
FOR DELETE
USING (false);